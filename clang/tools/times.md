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

```c
unsigned __int64 __rdtscp(unsigned int * _A);
```

参数`_A`：一个指向无符号整数的指针。函数执行后，会将当前处理器ID/核心ID 写入到这个内存地址。

返回值：一个64位无符号整数，代表当前时间戳计数器的值。

> [!NOTE]
> 下来给出了四种方法实现时间统计，每种方法分别针对Linux系统和Windows系统设计，但只测试了Linux系统上的可行性，没有测试Windows系统上是否可行。

在Linux/GCC环境下的使用示例：

```c
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

```c
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

### 时钟周期数转时间

将时钟周期转换为时间需要知道处理器的实际运行频率。

#### 方法1、使用固定频率（推荐用于现代CPU）

现代CPU大多支持 "Invariant TSC"（恒定时间戳计数器），这意味着TSC以固定频率递增，不受CPU频率调节的影响。

```c
#include <stdio.h>
#include <x86intrin.h>

// 假设CPU基准频率为2.5GHz（请根据你的CPU实际情况调整）
#define CPU_GHZ 2.5
#define NS_PER_SEC 1000000000ULL

int main() {
    unsigned int aux;
    unsigned long long tsc1, tsc2, cycles;
    double time_ns, time_us, time_ms;

    tsc1 = __rdtscp(&aux);
    
    // 执行要测量的代码
    for (volatile int i = 0; i < 1000000; ++i) {}
    
    tsc2 = __rdtscp(&aux);
    
    cycles = tsc2 - tsc1;
    
    // 转换为时间
    time_ns = (double)cycles / CPU_GHZ;           // 纳秒
    time_us = time_ns / 1000.0;                   // 微秒
    time_ms = time_us / 1000.0;                   // 毫秒
    
    printf("Elapsed cycles: %llu\n", cycles);
    printf("Time: %.2f ns, %.2f us, %.2f ms\n", time_ns, time_us, time_ms);
    
    return 0;
}
```

#### 方法2：运行时获取CPU频率（更准确）

在linux系统上，通过读取文件`/proc/cpuinfo`，获得准确的CPU频率，然后计算对应的时间。

```c
#include <stdio.h>
#include <x86intrin.h>
#include <stdlib.h>

double get_cpu_ghz() {
    FILE *fp = fopen("/proc/cpuinfo", "r");
    if (!fp) return 0.0;
    
    char line[256];
    double freq_ghz = 0.0;
    
    while (fgets(line, sizeof(line), fp)) {
        if (sscanf(line, "cpu MHz : %lf", &freq_ghz) == 1) {
            freq_ghz /= 1000.0;  // 转换为GHz
            break;
        }
    }
    fclose(fp);
    return freq_ghz;
}

int main() {
    double cpu_ghz = get_cpu_ghz();
    if (cpu_ghz == 0.0) {
        cpu_ghz = 2.5;  // 默认值
        printf("Warning: Using default CPU frequency: %.2f GHz\n", cpu_ghz);
    } else {
        printf("Detected CPU frequency: %.2f GHz\n", cpu_ghz);
    }
    
    unsigned int aux;
    unsigned long long tsc1, tsc2;
    
    tsc1 = __rdtscp(&aux);
    // 要测量的代码
    for (volatile int i = 0; i < 1000000; ++i) {}
    tsc2 = __rdtscp(&aux);
    
    unsigned long long cycles = tsc2 - tsc1;
    double time_ns = (double)cycles / cpu_ghz;
    
    printf("Cycles: %llu, Time: %.2f ns\n", cycles, time_ns);
    
    return 0;
}
```

类似的，在Windows系统上，获得准确的CPU频率，然后计算对应的时间。

```c
#include <stdio.h>
#include <intrin.h>
#include <windows.h>

#pragma intrinsic(__rdtscp)

double get_cpu_ghz() {
    HKEY hKey;
    DWORD freq_mhz = 0;
    DWORD size = sizeof(freq_mhz);
    
    if (RegOpenKeyExA(HKEY_LOCAL_MACHINE, 
                     "HARDWARE\\DESCRIPTION\\System\\CentralProcessor\\0", 
                     0, KEY_READ, &hKey) == ERROR_SUCCESS) {
        RegQueryValueExA(hKey, "~MHz", NULL, NULL, 
                        (LPBYTE)&freq_mhz, &size);
        RegCloseKey(hKey);
    }
    
    return freq_mhz / 1000.0;  // 转换为GHz
}
```

#### 方法3：使用标准库校准（最准确）

通过测量已知时间间隔内的周期数来计算实际频率。

```c
#include <stdio.h>
#include <x86intrin.h>
#include <time.h>
#include <unistd.h>  // for usleep

// 校准函数，计算实际的CPU频率
double calibrate_cpu_frequency() {
    const long long calibrate_time_us = 100000;  // 100ms校准时间
    unsigned int aux;
    
    // 第一次测量
    struct timespec start, end;
    unsigned long long tsc_start, tsc_end;
    
    clock_gettime(CLOCK_MONOTONIC, &start);
    tsc_start = __rdtscp(&aux);
    
    // 等待一段时间
    usleep(calibrate_time_us);
    
    clock_gettime(CLOCK_MONOTONIC, &end);
    tsc_end = __rdtscp(&aux);
    
    // 计算经过的时间（纳秒）
    long long time_ns = (end.tv_sec - start.tv_sec) * 1000000000LL + 
                       (end.tv_nsec - start.tv_nsec);
    
    // 计算频率（GHz）
    double freq_ghz = (double)(tsc_end - tsc_start) / time_ns;
    
    printf("Calibrated CPU frequency: %.6f GHz\n", freq_ghz);
    return freq_ghz;
}

int main() {
    double cpu_ghz = calibrate_cpu_frequency();
    unsigned int aux;
    unsigned long long tsc1, tsc2;
    
    tsc1 = __rdtscp(&aux);
    // 要测量的代码
    for (volatile int i = 0; i < 1000000; ++i) {}
    tsc2 = __rdtscp(&aux);
    
    unsigned long long cycles = tsc2 - tsc1;
    double time_ns = (double)cycles / cpu_ghz;
    
    printf("Performance results:\n");
    printf("  Cycles: %llu\n", cycles);
    printf("  Time: %.2f ns\n", time_ns);
    printf("  Time: %.2f us\n", time_ns / 1000.0);
    printf("  Time: %.2f ms\n", time_ns / 1000000.0);
    
    return 0;
}
```

#### 方法4：直接使用高精度计时器（最简单）

对于大多数应用，直接使用操作系统提供的高精度计时器可能更简单可靠：

对于Linux系统

```c
#include <time.h>

struct timespec start, end;
clock_gettime(CLOCK_MONOTONIC, &start);
// 要测量的代码
clock_gettime(CLOCK_MONOTONIC, &end);

long long time_ns = (end.tv_sec - start.tv_sec) * 1000000000LL +  (end.tv_nsec - start.tv_nsec);
```

对于Windows系统

```c
#include <windows.h>

LARGE_INTEGER frequency, start, end;
QueryPerformanceFrequency(&frequency);
QueryPerformanceCounter(&start);
// 要测量的代码
QueryPerformanceCounter(&end);

double time_sec = (double)(end.QuadPart - start.QuadPart) / frequency.QuadPart;
```