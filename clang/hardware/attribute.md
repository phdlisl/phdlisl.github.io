# `__attribute__`

`__attribute__` 是GCC编译器的一个扩展语法，用于为函数、变量、类型等添加特定的属性或修饰符，以控制编译器的行为。

函数原型

```c
// 基本语法
__attribute__((attribute_name))
__attribute__((attribute_name(parameters)))

// 多个属性
__attribute__((attribute1, attribute2, ...))
```

用于为函数、变量、类型等添加特定的属性或修饰符，下面是相关案例。

## 函数属性 (Function Attributes)

```c
// 指定函数不会返回
void fatal_error(const char* msg) __attribute__((noreturn));

void fatal_error(const char* msg) {
    fprintf(stderr, "Error: %s\n", msg);
    exit(1);
    // 函数不会返回，不需要return语句
}
```

```c
// 标记函数已过时
void old_function() __attribute__((deprecated));
void new_function() __attribute__((deprecated("Use new_function_v2 instead")));

void old_function() {
    // 旧实现
}
```

```c
// 在main函数之前/之后自动执行
void __attribute__((constructor)) init_function() {
    printf("在main之前执行\n");
}

void __attribute__((destructor)) cleanup_function() {
    printf("在main之后执行\n");
}
```

```c
// 强制内联函数
static inline __attribute__((always_inline)) 
int max(int a, int b) {
    return a > b ? a : b;
}
```

```c
// 禁止内联函数
void __attribute__((noinline)) debug_function() {
    // 调试函数，不希望被内联
}
```

## 变量属性 (Variable Attributes)

```c
// 指定变量对齐方式
int array[4] __attribute__((aligned(16)));           // 16字节对齐
double data __attribute__((aligned(32)));            // 32字节对齐

// SSE编程中的典型用法
float sse_data[4] __attribute__((aligned(16)));
```

```c
// 紧凑排列结构体，去除填充字节
struct __attribute__((packed)) Packet {
    char type;
    int size;
    short checksum;
};  // 大小为 1 + 4 + 2 = 7 字节

// 对比：普通结构体可能有填充字节
struct NormalPacket {
    char type;   // 1字节 + 3字节填充
    int size;    // 4字节
    short checksum; // 2字节 + 2字节填充
};  // 大小为 12 字节
```

```c
// 标记变量可能未使用，避免编译器警告
int __attribute__((unused)) debug_variable;

void function() {
    int __attribute__((unused)) temp_var = 42;
    // 变量可能在某些条件下不使用
}
```

```c
// 指定变量在特定段中
int __attribute__((section(".mysection"))) my_var;

// 常用于嵌入式系统
const char __attribute__((section(".rodata"))) config[] = "config_data";
```

## 类型属性 (Type Attributes)

```c
// 定义对齐的类型
typedef int __attribute__((aligned(16))) int_aligned16_t;

struct __attribute__((aligned(32))) AlignedStruct {
    int a;
    float b;
};  // 整个结构体32字节对齐
```

```c
// 定义紧凑类型
typedef struct __attribute__((packed)) {
    char a;
    int b;
} PackedStruct;
```

## SSE编程中的内存对齐

```c
#include <xmmintrin.h>

// 对齐的数组用于SSE操作
float input[4] __attribute__((aligned(16))) = {1.0f, 2.0f, 3.0f, 4.0f};
float output[4] __attribute__((aligned(16)));

void sse_example() {
    __m128 vec = _mm_load_ps(input);  // 需要对齐加载
    __m128 result = _mm_mul_ps(vec, vec);
    _mm_store_ps(output, result);
}
```