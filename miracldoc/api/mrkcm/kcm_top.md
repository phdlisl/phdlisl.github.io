# kcm_top

`kcm_top`


```c
extern BOOL  kcm_top(_MIPT_ int,big,big,big);
```

函数功能：

参数：

## 源码分析

`kcm_top`在模板文件`mrkcm.tpl`中实现。


```c
BOOL kcm_top(_MIPD_ int n,big x,big y,big z)
{ /* to support floating-point - see float.cpp and fmth function in big.cpp */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    unsigned int i;
    int len;
    zero(mr_mip->w0);

    if (n<MR_KCM)
    {
        mr_mip->check=OFF;
        multiply(_MIPP_ x,y,mr_mip->w0);
        mr_mip->check=ON;
    }
    else
    {
        for (i=2*n;i<(mr_mip->wt->len&MR_OBITS);i++) mr_mip->wt->w[i]=0;
        if (x==y)  mr_karsqr(n,mr_mip->wt->w,x->w,mr_mip->w0->w);
        else       mr_karmul(n,mr_mip->wt->w,x->w,y->w,mr_mip->w0->w);
        mr_mip->w0->len=mr_mip->wt->len=2*n;
        mr_lzero(mr_mip->w0);
    }
    len=mr_lent(mr_mip->w0);
    mr_shift(_MIPP_ mr_mip->w0,n-len,mr_mip->w0);
    copy(mr_mip->w0,z);
    if (len<2*n) return TRUE;
    return FALSE;
}
```