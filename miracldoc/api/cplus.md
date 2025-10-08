# C++中的函数

## 函数common()


## SSE2的常用指令（[来源](https://learn.microsoft.com/en-us/previous-versions/visualstudio/visual-studio-2008/)）

_mm_loadu_si128 : 

```c
__m128i _mm_loadu_si128 (__m128i const* mem_addr);
```

函数功能：加载128位的整数 mem_addr

_mm_xor_si128 ： 

```c
__m128i _mm_xor_si128 (__m128i a, __m128i b);
```

函数功能：128位整型数据a和b异或

_mm_aesenc_si128 ： 

```c
__m128i _mm_aesenc_si128 (__m128i a, __m128i RoundKey);
```

函数功能：用 RoundKey 中的轮密钥，对 a 做一次 AES 加密

_mm_aesenclast_si128 ： 

```c
__m128i _mm_aesenclast_si128 (__m128i a, __m128i RoundKey)；
```

函数功能：用 RoundKey 中的轮密钥，对 a 做最后一轮 AES 加密

_mm_storeu_si128 ： 

```c
void _mm_storeu_si128 (__m128i* mem_addr, __m128i a)；
```

函数功能：将128位数据a存储到内存

## modf()

`modf`是C语言库`math.h`中提供的函数

```c
extern double modf(double, double *);
```

函数功能：将浮点数分解为整数部分和小数部分

```c
#include <stdio.h>
#include <math.h>

int main() {
  double numbers[] = {123.456, -789.012, 0.0, 3.141592};
  double intPart;
  double fracPart;

  for(int i = 0; i < 4; i++) {
    fracPart = modf(numbers[i], &intPart);
    printf("Number: %.6f = Integer Part: %.0f + Fractional Part: %.6f\n", numbers[i], intPart, fracPart);
  }

  return 0;
}
```

测试输出

```
Number: 123.456000 = Integer Part: 123 + Fractional Part: 0.456000
Number: -789.012000 = Integer Part: -789 + Fractional Part: -0.012000
Number: 0.000000 = Integer Part: 0 + Fractional Part: 0.000000
Number: 3.141592 = Integer Part: 3 + Fractional Part: 0.141592
```


