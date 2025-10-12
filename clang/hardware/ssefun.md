# SSE函数

SSE（Streaming SIMD Extensions）函数，是Intel推出的一套SIMD指令集扩展。

SSE是Intel在1999年推出的SIMD（单指令多数据）指令集，允许在单个指令中同时处理多个数据元素，显著提升多媒体和科学计算应用的性能。

基本数据类型

```c
#include <xmmintrin.h>  // SSE
#include <emmintrin.h>  // SSE2

// 主要数据类型：
__m128     // 4个单精度浮点数
__m128d    // 2个双精度浮点数  
__m128i    // 整数（16×8位, 8×16位, 4×32位, 2×64位）
```

常用SSE函数分类

* 数据加载和存储
* 算术运算
* 比较运算
* 逻辑运算
* 位移运算

```c
// 加载操作
__m128 _mm_load_ps(float* p);     // 对齐加载
__m128 _mm_loadu_ps(float* p);    // 未对齐加载
__m128 _mm_set_ps(float z, float y, float x, float w); // 设置值

// 存储操作
void _mm_store_ps(float* p, __m128 a);    // 对齐存储
void _mm_storeu_ps(float* p, __m128 a);   // 未对齐存储

// 算术运算
__m128 _mm_add_ps(__m128 a, __m128 b);    // a + b
__m128 _mm_add_ss(__m128 a, __m128 b);    // 仅低32位相加
__m128 _mm_sub_ps(__m128 a, __m128 b);    // a - b
__m128 _mm_mul_ps(__m128 a, __m128 b);    // a * b
__m128 _mm_div_ps(__m128 a, __m128 b);    // a / b
__m128 _mm_sqrt_ps(__m128 a);             // sqrt(a)

// 比较运算
__m128 _mm_cmpeq_ps(__m128 a, __m128 b);  // a == b
__m128 _mm_cmpgt_ps(__m128 a, __m128 b);  // a > b
__m128 _mm_cmplt_ps(__m128 a, __m128 b);  // a < b
__m128 _mm_cmpge_ps(__m128 a, __m128 b);  // a >= b
__m128 _mm_cmple_ps(__m128 a, __m128 b);  // a <= b

// 逻辑运算
__m128 _mm_and_ps(__m128 a, __m128 b);    // 按位与
__m128 _mm_or_ps(__m128 a, __m128 b);     // 按位或  
__m128 _mm_xor_ps(__m128 a, __m128 b);    // 按位异或
__m128 _mm_andnot_ps(__m128 a, __m128 b); // 按位与非

// 移位和混洗
__m128 _mm_shuffle_ps(__m128 a, __m128 b, int imm8); // 混洗
__m128i _mm_slli_epi32(__m128i a, int count);        // 左移
```


## `_mm_load_ps`

`_mm_load_ps` 用于从内存中加载4个单精度浮点数到SSE寄存器中，要求内存地址必须16字节对齐。

```c
__m128 _mm_load_ps(float const* mem_addr);
```

```c
#include <xmmintrin.h>
#include <stdio.h>

int main() {
    // 16字节对齐的数组（C11对齐语法）
    float aligned_array[4] __attribute__((aligned(16))) = {1.0f, 2.0f, 3.0f, 4.0f};
    
    // 使用_mm_load_ps加载数据
    __m128 vec = _mm_load_ps(aligned_array);
    
    // 将结果存回另一个对齐数组
    float result[4] __attribute__((aligned(16)));
    _mm_store_ps(result, vec);
    
    printf("Loaded values: %.1f, %.1f, %.1f, %.1f\n", 
           result[0], result[1], result[2], result[3]);
    
    return 0;
}
```

## `_mm_loadu_ps`