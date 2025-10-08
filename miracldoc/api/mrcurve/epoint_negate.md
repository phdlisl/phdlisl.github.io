# epoint_negate

`epoint_negate`

```c
extern void epoint_negate(_MIPT_ epoint *);
```

函数功能：两个`big`类型数据的减法运算，减去的值为`p`中的一个坐标。

参数`_MIPD_`：可能为空，非空为`miracl *`类型。

参数`p`：`epoint`类型值。


## 源码分析

```c
void epoint_negate(_MIPD_ epoint *p)
{ /* negate a point */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return;
    if (p->marker==MR_EPOINT_INFINITY) return;

    MR_IN(121)
    if (size(p->Y)!=0) mr_psub(_MIPP_ mr_mip->modulus,p->Y,p->Y);
    MR_OUT
}
```

[mr_psub](/parts/api/mrarth0/mr_psub.md)做两个数的减法运算，即`p->Y = mr_mip->modulus - p->Y`。


```c
void epoint_negate(_MIPD_ epoint *p)
{ /* negate a point */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return;
    if (p->marker==MR_EPOINT_INFINITY) return;

    MR_IN(121)
    if (size(p->X)!=0) mr_psub(_MIPP_ mr_mip->modulus,p->X,p->X);
    MR_OUT
}
```
