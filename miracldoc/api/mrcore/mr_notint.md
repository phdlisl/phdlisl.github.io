# mr_notint

`mr_notint`定义在`miracl.h`

```c
extern BOOL  mr_notint(flash);
```

函数功能：判断参数`x`是否为`flash`类型数值，返回`TRUE`或者`FALSE`。

参数`x`：`flash`类型数值。


## 源码分析

`mr_notint`实现在`mrcore.c`

```c
#define MR_FLASH      52  // 定义在mirdef.h
#define MR_IBITS      32  // 定义在mirdef.h

#ifdef  MR_FLASH
#define MR_EBITS (8*sizeof(double) - MR_FLASH)
                                  /* no of Bits per double exponent */
#define MR_BTS 16
#define MR_MSK 0xFFFF
#endif

#define MR_MSBIT ((mr_lentype)1<<(MR_IBITS-1)) // 将1左移31位

#define MR_OBITS (MR_MSBIT-1)

BOOL mr_notint(flash x)
{ /* returns TRUE if x is Flash */
#ifdef MR_FLASH
    if ((((x->len&(MR_OBITS))>>(MR_BTS))&(MR_MSK))!=0) return TRUE;
#endif
    return FALSE;
}
```

`MR_MSBIT`为`(mr_lentype)1<<(MR_IBITS-1)`，将1左移31位，得到`10000000000000000000000000000000`。

`MR_OBITS`为`MR_MSBIT-1`减1，得到`01111111111111111111111111111111`。

`x->len&(MR_OBITS)>>(MR_BTS)`中，`x->len`的4字节右移16位，得到高位两字节。如果高位两字节不为0，返回`TRUE`或者`FALSE`。