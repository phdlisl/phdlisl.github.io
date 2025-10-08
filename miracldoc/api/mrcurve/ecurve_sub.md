# ecurve_sub


```c
extern int  ecurve_sub(_MIPT_ epoint *,epoint *);
```

函数功能：减法运算。

参数`_MIPD_`：可能为空，非空为`miracl *`类型。

参数`p`：`epoint`类型数据。

参数`pa`：`epoint`类型数据。

## 源码分析

```c
int ecurve_sub(_MIPD_ epoint *p,epoint *pa)
{
    int r;
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return MR_OVER;

    MR_IN(104)

    if (p==pa)
    {
        epoint_set(_MIPP_ NULL,NULL,0,pa);
        MR_OUT
        return MR_OVER;
    } 
    if (p->marker==MR_EPOINT_INFINITY) 
    {
        MR_OUT
        return MR_ADD;
    }

    epoint_negate(_MIPP_ p); // 更新坐标
    r=ecurve_add(_MIPP_ p,pa); // pa=pa+p
    epoint_negate(_MIPP_ p);

    MR_OUT
    return r;
}
```

[ecurve_add](/parts/api/mrcurve/ecurve_add.md)完成椭圆曲线上的两个点相加，`pa=pa+p`。

[epoint_negate](/parts/api/mrcurve/epoint_negate.md)做两个数的减法运算，更新`p`的坐标。


