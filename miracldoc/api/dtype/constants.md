# 字符常量

项目中涉及到的字符常量。

## 错误提示相关的常量

```c
/* error returns 错误提示相关的常量 */

#define MR_ERR_BASE_TOO_BIG       1
#define MR_ERR_DIV_BY_ZERO        2
#define MR_ERR_OVERFLOW           3
#define MR_ERR_NEG_RESULT         4
#define MR_ERR_BAD_FORMAT         5
#define MR_ERR_BAD_BASE           6
#define MR_ERR_BAD_PARAMETERS     7
#define MR_ERR_OUT_OF_MEMORY      8
#define MR_ERR_NEG_ROOT           9
#define MR_ERR_NEG_POWER         10
#define MR_ERR_BAD_ROOT          11
#define MR_ERR_INT_OP            12
#define MR_ERR_FLASH_OVERFLOW    13
#define MR_ERR_TOO_BIG           14
#define MR_ERR_NEG_LOG           15
#define MR_ERR_DOUBLE_FAIL       16
#define MR_ERR_IO_OVERFLOW       17
#define MR_ERR_NO_MIRSYS         18
#define MR_ERR_BAD_MODULUS       19
#define MR_ERR_NO_MODULUS        20
#define MR_ERR_EXP_TOO_BIG       21
#define MR_ERR_NOT_SUPPORTED     22
#define MR_ERR_NOT_DOUBLE_LEN    23
#define MR_ERR_NOT_IRREDUC       24
#define MR_ERR_NO_ROUNDING       25
#define MR_ERR_NOT_BINARY        26
#define MR_ERR_NO_BASIS          27
#define MR_ERR_COMPOSITE_MODULUS 28
#define MR_ERR_DEV_RANDOM        29
```

## 椭圆曲线上点的状态

```c
/* Elliptic curve point status */

#define MR_EPOINT_GENERAL    0
#define MR_EPOINT_NORMALIZED 1
#define MR_EPOINT_INFINITY   2

#define MR_NOTSET     0
#define MR_PROJECTIVE 0
#define MR_AFFINE     1
#define MR_BEST       2
#define MR_TWIST      8

#define MR_OVER       0
#define MR_ADD        1
#define MR_DOUBLE     2

/* Twist type 扭曲类型 */

#define MR_QUADRATIC 2
#define MR_CUBIC_M   0x3A
#define MR_CUBIC_D   0x3B
#define MR_QUARTIC_M 0x4A
#define MR_QUARTIC_D 0x4B
#define MR_SEXTIC_M  0x6A
#define MR_SEXTIC_D  0x6B
```

## BOOL

定义在`miracl.h`

```c
#ifndef TRUE
  #define TRUE 1
#endif
#ifndef FALSE
  #define FALSE 0
#endif

typedef int BOOL;
```

## 数值

`MR_IBITS`定义在`mirdef.h`，表示`int`类型数据的比特位数，32位也即4个字节，也就是`int`类型数据占4个字节单元。

```c
#define MR_IBITS      32    /* bits in int  	比特位数	*/

typedef unsigned int mr_lentype;

/* 将1左移 MR_IBITS-1 位 */
#define MR_MSBIT ((mr_lentype)1<<(MR_IBITS-1))

#define MR_OBITS (MR_MSBIT-1)
```

`MR_MSBIT`将1强制转换为`mr_lentype`类型，也即00000000000000000000000000000001，然后左移31位，得到10000000000000000000000000000000。

`MR_OBITS`将10000000000000000000000000000000减1，得到01111111111111111111111111111111。

## 其他

```c
#define MR_MAXDEPTH 24  /* max routine stack depth */
```
