# zero

`zero`定义在`miracl.h`

```c
extern void  zero(flash);
```

函数功能：将数值设置为$$0$$。

参数`x`：`big`或者`flash`类型数值。

## 源码分析

`zero`实现在`mrcore.c`

```c
void zero(flash x)
{ /* set big/flash number to zero */
    int i,n;
    mr_small *g;
    if (x==NULL) return;
#ifdef MR_FLASH
    n=mr_lent(x); // 符点数长度
#else
    n=(x->len&MR_OBITS);
#endif
    g=x->w;

    for (i=0;i<n;i++)
        g[i]=0;

    x->len=0;
}
```

如果是`MR_FLASH`，[mr_lent](/miracldoc/api/mrcore/mr_lent.md)计算低位两字节与高位两字节的和，否则[MR_OBITS](/miracldoc/api/dtype/constants.md)与参数`x`的长度按位与运算。



