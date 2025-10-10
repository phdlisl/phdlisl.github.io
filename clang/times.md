# 时间统计

统计程序执行时间，主要用于分析程序性能。主要分为两大类统计方案，一种是一般精度时间统计，一种是高精度时间统计。

## 一般精度时间统计

todo

## 高精度时间统计

对于高精度时间统计方案，主要介绍`__rdtsc`和`__rdtscp`等方案。

### 高精度时间统计

`__rdtsc`

### 极高精度时间统计

`__rdtscp` 是一个编译器内置函数，用于读取处理器的时间戳计数器，并确保序列化执行，同时读取处理器的核心ID。

```
unsigned __int64 __rdtscp(unsigned int * _A);
```

参数`_A`：一个指向无符号整数的指针。函数执行后，会将当前处理器ID/核心ID 写入到这个内存地址。

返回值：一个64位无符号整数，代表当前时间戳计数器的值。

在Linux/GCC环境下的使用示例：

```
#include <stdio.h>
#include <x86intrin.h> // 包含 __rdtscp 等 intrinsic 函数的头文件

int main() {
    unsigned int aux; // 用于存储处理器ID的变量
    unsigned long long tsc1, tsc2;

    // 第一次读取
    tsc1 = __rdtscp(&aux);
    printf("First read: TSC = %llu, Processor ID = %u\n", tsc1, aux);

    // 执行一些操作，例如一个简单的循环
    for (volatile int i = 0; i < 1000000; ++i) {}

    // 第二次读取
    tsc2 = __rdtscp(&aux);
    printf("Second read: TSC = %llu, Processor ID = %u\n", tsc2, aux);

    // 计算时间差（时钟周期数）
    printf("Elapsed cycles: %llu\n", tsc2 - tsc1);

    return 0;
}
```

在Windows/MSVC下的示例：

```
#include <stdio.h>
#include <intrin.h> // MSVC 的头文件

#pragma intrinsic(__rdtscp) // 告诉编译器使用内置函数

int main() {
    unsigned int aux;
    unsigned __int64 tsc1, tsc2;

    tsc1 = __rdtscp(&aux);
    // ... 做一些操作
    tsc2 = __rdtscp(&aux);

    printf("Elapsed cycles: %llu\n", tsc2 - tsc1);
    return 0;
}
```

`__rdtscp` 指令本身有执行开销（几十到上百个时钟周期），在测量非常短的代码段时，这个开销本身会占据很大比例，影响结果的准确性。
虽然序列化保证了准确性，但它也阻止了CPU的并行优化，可能会使得测量的代码性能与正常运行时的性能略有不同。

对于大多数不需要检测核心迁移的场景，使用它的轻量级版本 `__rdtsc` 就足够了。但在需要最高可靠性的基准测试中，`__rdtscp` 是更专业和可靠的选择。