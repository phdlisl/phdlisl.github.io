# ecurve_add

`ecurve_add`定义在`miracl.h`

```c
extern int  ecurve_add(_MIPT_ epoint *,epoint *);
```

函数功能：椭圆曲线上的两个点相加，`pa=pa+p`。

参数`_MIPD_`：可能为空，非空为`miracl *`类型。

参数`p`：椭圆曲线上的点。

参数`pa`：椭圆曲线上的点。

## 源码分析

`ecurve_add`实现在`mrcurve.c`

```c
int ecurve_add(_MIPD_ epoint *p,epoint *pa)
{  /* pa=pa+p; */

#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return MR_OVER;

    MR_IN(94)

    if (p==pa) 
    {
        ecurve_double(_MIPP_ pa);
        MR_OUT
        if (pa->marker==MR_EPOINT_INFINITY) return MR_OVER;
        return MR_DOUBLE;
    }
    if (pa->marker==MR_EPOINT_INFINITY)
    {
        epoint_copy(p,pa);
        MR_OUT 
        return MR_ADD;
    }
    if (p->marker==MR_EPOINT_INFINITY) 
    {
        MR_OUT
        return MR_ADD;
    }

    if (!ecurve_padd(_MIPP_ p,pa))
    {    
        ecurve_double(_MIPP_ pa);
        MR_OUT
        return MR_DOUBLE;
    }
    MR_OUT
    if (pa->marker==MR_EPOINT_INFINITY) return MR_OVER;
    return MR_ADD;
}

int ecurve_add(_MIPD_ epoint *p,epoint *pa)
{  /* pa=pa+p; */

#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return MR_OVER;

    MR_IN(94)

    if (p==pa) 
    {
        ecurve_double(_MIPP_ pa);
        MR_OUT
        if (pa->marker==MR_EPOINT_INFINITY) return MR_OVER;
        return MR_DOUBLE;
    }
    if (pa->marker==MR_EPOINT_INFINITY)
    {
        epoint_copy(p,pa);
        MR_OUT 
        return MR_ADD;
    }
    if (p->marker==MR_EPOINT_INFINITY) 
    {
        MR_OUT
        return MR_ADD;
    }

    if (!ecurve_padd(_MIPP_ p,pa))
    {    
        ecurve_double(_MIPP_ pa);
        MR_OUT
        return MR_DOUBLE;
    }
    MR_OUT
    if (pa->marker==MR_EPOINT_INFINITY) return MR_OVER;
    return MR_ADD;
}
```

[get_mip](/miracldoc/api/mrcore/get_mip.md)

[ecurve_double](/miracldoc/api/mrcurve/ecurve_double.md)

[ecurve_padd](/miracldoc/api/mrcurve/ecurve_padd.md)


