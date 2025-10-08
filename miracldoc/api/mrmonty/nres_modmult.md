# nres_modmult

`nres_modmult`

```c
extern void  nres_modmult(_MIPT_ big,big,big); 
```

函数功能：取模运算，计算`w=x*y mod n`。

参数`_MIPD_`：可能为空，非空为`miracl *`类型。

参数`x`：`big`类型数据。

参数`y`：`big`类型数据。

参数`w`：`big`类型数据。

## 源码分析

```c
void nres_modmult(_MIPD_ big x,big y,big w)
{ /* Modular multiplication using n-residues w=x*y mod n */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if ((x==NULL || x->len==0) && x==w) return;
    if ((y==NULL || y->len==0) && y==w) return;
    if (y==NULL || x==NULL || x->len==0 || y->len==0)
    {
        zero(w);
        return;
    }
#ifdef MR_COUNT_OPS
fpc++;
#endif
#ifdef MR_COMBA
    if (mr_mip->ACTIVE)
    {
        if (x==y) comba_square(x,mr_mip->w0);
        else      comba_mult(x,y,mr_mip->w0);
        comba_redc(_MIPP_ mr_mip->w0,w);
    }
    else
    {
#endif
#ifdef MR_KCM
    if (mr_mip->ACTIVE)
    {
        if (x==y) kcm_sqr(_MIPP_ x,mr_mip->w0);
        else      kcm_mul(_MIPP_ x,y,mr_mip->w0);
        kcm_redc(_MIPP_ mr_mip->w0,w);
    }
    else
    { 
#endif
#ifdef MR_PENTIUM
    if (mr_mip->ACTIVE)
    {
        if (x==y) fastmodsquare(_MIPP_ x,w);
        else      fastmodmult(_MIPP_ x,y,w);
    }
    else
    { 
#endif
        if (mr_mip->ERNUM) return;

        MR_IN(83)

        mr_mip->check=OFF;
        multiply(_MIPP_ x,y,mr_mip->w0);
        redc(_MIPP_ mr_mip->w0,w);
        mr_mip->check=ON;
        MR_OUT
#ifdef MR_COMBA
}
#endif
#ifdef MR_KCM
}
#endif
#ifdef MR_PENTIUM
}
#endif

}
```