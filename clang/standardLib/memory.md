# 内存分配

内存分配相关的函数

## malloc

`malloc` 是 C 语言标准库中的动态内存分配函数，用于在堆（heap）区分配指定大小的内存块。

```
#include <stdlib.h>

void* malloc(size_t size);
```

参数说明

* size: 要分配的字节数

返回值

* 成功：返回指向分配内存起始地址的指针（类型为 void*）
* 失败：返回 NULL

```
#include <stdio.h>
#include <stdlib.h>

int main() {
    // 分配内存
    int* arr = (int*)malloc(10 * sizeof(int));
    
    if (arr == NULL) {
        printf("内存分配失败\n");
        return 1;
    }
    
    // 使用内存
    for (int i = 0; i < 10; i++) {
        arr[i] = i * 10;
    }
    
    // 打印结果
    for (int i = 0; i < 10; i++) {
        printf("%d ", arr[i]);
    }
    
    // 释放内存
    free(arr);
    
    return 0;
}
```


## free

`free()`释放内存，`calloc()`分配并清零内存，`realloc()`调整已分配内存的大小。

> [!NOTE]
> `free()`只能释放一个连续内存空间。


## _mm_malloc

`_mm_malloc` 是 Intel 提供的内存分配函数，主要用于分配对齐的内存块，特别适用于需要 SSE/AVX 等 SIMD 指令集优化的场景。

```
void* _mm_malloc(size_t size, size_t align);
```

参数说明

* size: 要分配的字节数
* align: 对齐边界，必须是 2 的幂次方，且至少为 sizeof(void*)

```
#include <stdio.h>
#include <emmintrin.h>  // 需要包含这个头文件

int main() {
    // 分配 64 字节内存，按 16 字节对齐（SSE 要求）
    float* aligned_data = (float*)_mm_malloc(64, 16);
    
    if (aligned_data != NULL) {
        // 使用对齐的内存进行 SIMD 操作
        __m128 vec = _mm_load_ps(aligned_data);  // 安全加载，不会段错误
        
        // ... 处理数据
        printf("create memory\n");
        
        _mm_free(aligned_data);  // 必须使用配套的释放函数
    }
    return 0;
}
```

16字节对齐，适用于SSE指令集；32字节对齐，适用于AVX指令集；64字节对齐，适用于AVX-512指令集。对齐值必须是 2 的幂次方。

```
// 标准 malloc - 对齐不确定
void* data1 = malloc(64);  // 对齐可能不是16字节

// _mm_malloc - 保证对齐
void* data2 = _mm_malloc(64, 16);  // 保证16字节对齐
```

必须使用 `_mm_free` 释放，不能使用 `free()`。需要包含 `<emmintrin.h>` 或 `<xmmintrin.h>` 头文件

## _mm_free

```
void _mm_free(void* ptr);
```

`malloc`与 `_mm_malloc` 的区别

特性 | `malloc` | `_mm_malloc` 
标准性 | C 标准函数 | 编译器扩展
对齐| 实现定义 | 指定对齐
释放 | 使用 `free()` | 使用 `_mm_free()`
用途 | 通用内存分配 | SIMD/特定对齐需求
