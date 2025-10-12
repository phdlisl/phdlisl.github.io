# 指令集

指令集描述某个类型的CPU所完成的所有功能，不同CPU的指令集不同。

| 指令集 | 类型 | 主要应用领域 | 主导公司/组织 |
| ---- | ---- | ---- | ---- |
| x86 / x86-64 | CISC | 个人电脑、服务器、笔记本电脑 | Intel, AMD |
| ARM | RISC | 智能手机、平板、嵌入式、物联网、Mac | ARM Holdings（授权） |
| RISC-V | RISC | 嵌入式、IoT、新兴计算领域（开源） | RISC-V International |
| MIPS | RISC | 网络设备、嵌入式历史领域 | MIPS Technologies |
| PowerPC | RISC | 早期Mac、游戏机、高性能计算 | IBM, Freescale |

CISC表示复杂指令集，RISC表示精简指令集。

* 台湾积体电路制造股份有限公司（简称“[台积电](https://www.tsmc.com/schinese?to2=stpancras.com)”）是全球最大的专业集成电路制造服务企业，主要产品应用于手机芯片、智能卡等领域。
* [高通（Qualcomm）](https://www.qualcomm.com)是一家主要从事电子科技行业的上市公司，经营范围包括发明移动基础科技，研发无线芯片平台和其它产品解决方案等。骁龙（Snapdragon）是美国高通公司推出的移动处理器系列，自2007年发布以来已成为全球领先的智能计算平台。
* 联发科技股份有限公司（英文名：MediaTek Inc.MTK）简称[联发科](https://www.mediatek.com)，是一家以从事半导体及相关设备为主的企业。

## SIMD指令集

SIMD 的全称是 Single Instruction, Multiple Data。单指令表示CPU只执行一条指令，多数据表示这条指令可以同时处理多个数据元素。它是一种并行处理技术，不是多核CPU，而是一个CPU核心内部的数据级并行。

在多媒体、科学计算、机器学习等众多领域，程序经常需要对大量数据（如数组、向量、像素）执行完全相同的操作。如果没有SIMD，CPU需要循环执行一条条指令，效率低下。有了SIMD，就可以大幅压缩处理时间。


## SSE指令集

SSE 的全称是 Streaming SIMD Extensions。

* 它是 Intel 公司提出的一套SIMD指令集实现，首次出现在1999年的Pentium III处理器中。
* 它是x86架构对SIMD能力的一次重大扩展，后来被AMD等其他厂商采纳。
* SSE引入了一套新的128位寄存器，称为 XMM0 ~ XMM7（后续版本增多）

SSE本身也是一个系列，包括：

* SSE：主要支持单精度浮点数。
* SSE2：加入了双精度浮点数和整型支持，成为最基础和重要的一代。
* SSE3、SSSE3、SSE4.1/4.2：不断增加新的专用指令，如点积、字符串处理、popcnt（位计数）等，进一步增强功能。

SIMD 是一个广义的概念和思想，一种并行计算模型。SSE 是x86架构上实现SIMD思想的一个具体指令集。

## 一个简单的代码示例

假设我们要将两个浮点数数组 a 和 b 的每一个元素相加，结果存入数组 c。

传统标量方式（C代码）：

```c
for (int i = 0; i < 1024; i++) {
    c[i] = a[i] + b[i]; // 每次循环只做一次加法
}
```

使用SSE的SIMD方式（伪代码概念）：

```c
#include <xmmintrin.h> // SSE头文件
// 假设数组是16字节对齐的
for (int i = 0; i < 1024; i += 4) { // 每次步进4个元素
    // 一次从内存加载4个float到SSE寄存器
    __m128 vec_a = _mm_load_ps(&a[i]);
    __m128 vec_b = _mm_load_ps(&b[i]);
    // 一条指令，同时执行4个加法
    __m128 vec_c = _mm_add_ps(vec_a, vec_b);
    // 将结果（4个float）一次性存回内存
    _mm_store_ps(&c[i], vec_c);
}
```

完善上述案例，完整代码如下

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <xmmintrin.h> // SSE头文件
#include <math.h>

// 函数声明
void normal_vector_add(float* a, float* b, float* c, int n);
void sse_vector_add(float* a, float* b, float* c, int n);
int verify_results(float* c1, float* c2, int n);

int main() {
    const int ARRAY_SIZE = 1024;
    
    // 分配对齐的内存（16字节对齐，这对SSE很重要）
    float* a = (float*)_mm_malloc(ARRAY_SIZE * sizeof(float), 16);
    float* b = (float*)_mm_malloc(ARRAY_SIZE * sizeof(float), 16);
    float* c_normal = (float*)_mm_malloc(ARRAY_SIZE * sizeof(float), 16);
    float* c_sse = (float*)_mm_malloc(ARRAY_SIZE * sizeof(float), 16);
    
    if (a == NULL || b == NULL || c_normal == NULL || c_sse == NULL) {
        printf("内存分配失败！\n");
        return -1;
    }
    
    // 初始化数组
    printf("初始化数组...\n");
    for (int i = 0; i < ARRAY_SIZE; i++) {
        a[i] = (float)i;           // a = [0, 1, 2, 3, ...]
        b[i] = (float)(i * 2);     // b = [0, 2, 4, 6, ...]
        c_normal[i] = 0.0f;
        c_sse[i] = 0.0f;
    }
    
    // 测试普通方法的性能
    printf("\n执行普通向量加法...\n");
    clock_t start = clock();
    normal_vector_add(a, b, c_normal, ARRAY_SIZE);
    clock_t end = clock();
    double normal_time = ((double)(end - start)) / CLOCKS_PER_SEC * 1000.0;
    
    // 测试SSE方法的性能
    printf("执行SSE向量加法...\n");
    start = clock();
    sse_vector_add(a, b, c_sse, ARRAY_SIZE);
    end = clock();
    double sse_time = ((double)(end - start)) / CLOCKS_PER_SEC * 1000.0;
    
    // 验证结果是否正确
    printf("\n验证结果...\n");
    if (verify_results(c_normal, c_sse, ARRAY_SIZE)) {
        printf("✓ 结果验证成功！两种方法计算结果一致。\n");
    } else {
        printf("✗ 结果验证失败！\n");
    }
    
    // 显示性能对比
    printf("\n性能对比：\n");
    printf("普通方法: %.4f 毫秒\n", normal_time);
    printf("SSE方法 : %.4f 毫秒\n", sse_time);
    printf("加速比: %.2fx\n", normal_time / sse_time);
    
    // 显示前10个结果作为示例
    printf("\n前10个结果示例：\n");
    printf("Index\t普通方法\tSSE方法\n");
    for (int i = 0; i < 10 && i < ARRAY_SIZE; i++) {
        printf("%d\t%.1f\t\t%.1f\n", i, c_normal[i], c_sse[i]);
    }
    
    // 清理内存
    _mm_free(a);
    _mm_free(b);
    _mm_free(c_normal);
    _mm_free(c_sse);
    
    return 0;
}

// 普通的向量加法（标量运算）
void normal_vector_add(float* a, float* b, float* c, int n) {
    for (int i = 0; i < n; i++) {
        c[i] = a[i] + b[i];  // 每次循环只处理一个元素
    }
}

// 使用SSE的向量加法（向量化运算）
void sse_vector_add(float* a, float* b, float* c, int n) {
    int i;
    // 每次处理4个元素（因为SSE寄存器是128位，可以放4个float）
    for (i = 0; i < n - 3; i += 4) {
        // 从内存加载4个float到SSE寄存器
        __m128 vec_a = _mm_load_ps(&a[i]);  // 加载a[i]到a[i+3]
        __m128 vec_b = _mm_load_ps(&b[i]);  // 加载b[i]到b[i+3]
        
        // 单条指令同时执行4个加法
        __m128 vec_c = _mm_add_ps(vec_a, vec_b);
        
        // 将结果存回内存
        _mm_store_ps(&c[i], vec_c);
    }
    
    // 处理剩余的元素（如果不能被4整除）
    for (; i < n; i++) {
        c[i] = a[i] + b[i];
    }
}

// 验证两个结果数组是否相同
int verify_results(float* c1, float* c2, int n) {
    for (int i = 0; i < n; i++) {
        // 浮点数比较，使用小的容差值
        if (fabs(c1[i] - c2[i]) > 1e-6f) {
            printf("在索引 %d 处发现差异: %.6f vs %.6f\n", i, c1[i], c2[i]);
            return 0;
        }
    }
    return 1;
}
```

