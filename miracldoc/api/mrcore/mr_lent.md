# mr_lent

`mr_lent`定义在`miracl.h`

```c
extern int   mr_lent(flash);
```

函数功能：返回数值的长度。

参数`x`：浮点数值。


## 源码分析

`mr_lent`实现在`mrcore.c`

```c
#define MR_FLASH      52  // 定义在mirdef.h

#ifdef  MR_FLASH
#define MR_EBITS (8*sizeof(double) - MR_FLASH)
                                  /* no of Bits per double exponent */
#define MR_BTS 16
#define MR_MSK 0xFFFF
#endif

typedef unsigned int mr_lentype;

int mr_lent(flash x)
{ /* return length of big or flash in words */
    mr_lentype lx;
    lx=(x->len&(MR_OBITS));
#ifdef MR_FLASH
    return (int)((lx&(MR_MSK))+((lx>>(MR_BTS))&(MR_MSK)));
#else
    return (int)lx;
#endif
}
```

[flash类型](/miracldoc/api/dtype/big.md)数据`x`的长度与[MR_OBITS](/miracldoc/api/dtype/constants.md)做按位与运算。

如果定义了`MR_FLASH`，返回的是低位两字节与高位两字节的和，否则返回的是`x`的长度。

`lx&(MR_MSK)`取得`lx`的低位两个字节，`(lx>>(MR_BTS))&(MR_MSK)`取得`lx`的高位两个字节，低位两个字节与高位两个字节相加。


