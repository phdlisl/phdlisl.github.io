# ecurve

`ecurve`定义在`big.h`，实现在`big.cpp`。

```c
friend void ecurve(const Big&,const Big&,const Big&,int);
```

```c
void ecurve(const Big& a,const Big& b,const Big& p,int t)
{
    ecurve_init(a.fn,b.fn,p.fn,t);
}
```

`ecurve_init`定义在`miracl.h`，实现在`mrmonty.c`，`ecurve_init`初始化一个椭圆曲线。

```c
extern void ecurve_init(_MIPT_ big,big,big,int);
```

```c
/* initialise elliptic curve */

void ecurve_init(_MIPD_ big a,big b,big p,int type)
{ /* Initialize the active ecurve    *
   * Asize indicate size of A        *
   * Bsize indicate size of B        */
    int as;
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return;

    MR_IN(93)

#ifndef MR_NO_SS
    mr_mip->SS=FALSE;       /* no special support for super-singular curves */ 
#endif

    prepare_monty(_MIPP_ p);

    mr_mip->Asize=size(a);
    if (mr_abs(mr_mip->Asize)==MR_TOOBIG)
    {
        if (mr_mip->Asize>=0)
        { /* big positive number - check it isn't minus something small */
           copy(a,mr_mip->w1);
           divide(_MIPP_ mr_mip->w1,p,p);
           subtract(_MIPP_ p,mr_mip->w1,mr_mip->w1);
           as=size(mr_mip->w1);
           if (as<MR_TOOBIG) mr_mip->Asize=-as;
        }
    }
    nres(_MIPP_ a,mr_mip->A);

    mr_mip->Bsize=size(b);
    if (mr_abs(mr_mip->Bsize)==MR_TOOBIG) 
    {
        if (mr_mip->Bsize>=0)
        { /* big positive number - check it isn't minus something small */
           copy(b,mr_mip->w1);
           divide(_MIPP_ mr_mip->w1,p,p);
           subtract(_MIPP_ p,mr_mip->w1,mr_mip->w1);
           as=size(mr_mip->w1);
           if (as<MR_TOOBIG) mr_mip->Bsize=-as;
        }
    }

    nres(_MIPP_ b,mr_mip->B);
#ifdef MR_EDWARDS
    mr_mip->coord=MR_PROJECTIVE; /* only type supported for Edwards curves */
#else
#ifndef MR_AFFINE_ONLY
    if (type==MR_BEST) mr_mip->coord=MR_PROJECTIVE;
    else mr_mip->coord=type;
#else
    if (type==MR_PROJECTIVE)
        mr_berror(_MIPP_ MR_ERR_NOT_SUPPORTED);
#endif
#endif
    MR_OUT
    return;
}
```