# kcm_redc

`kcm_redc`


```c
extern void  kcm_redc(_MIPT_ big,big);
```

函数功能：

参数：

## 源码分析

`kcm_redc`在模板文件`mrkcm.tpl`中实现。

```c
void kcm_redc(_MIPD_ big z,big w)
{ /* fast karatsuba Montgomery reduction */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    int m,ml=(int)mr_mip->modulus->len;
    unsigned int i;
    m=ml/MR_KCM;
    copy(z,mr_mip->w0);

    for (i=2*ml;i<(mr_mip->wt->len&MR_OBITS);i++) mr_mip->wt->w[i]=0;
    mr_cpy(&(mr_mip->w0->w[ml]),w->w,m);

    mr_karmul_lower(ml,mr_mip->wt->w,mr_mip->w0->w,mr_mip->big_ndash->w,mr_mip->ws->w);

    for (i=ml;i<(w->len&MR_OBITS);i++) w->w[i]=0;

    mr_mip->ws->len=w->len=ml;

    mr_karmul_upper(ml,mr_mip->wt->w,mr_mip->ws->w,mr_mip->modulus->w,mr_mip->w0->w);
    mr_mip->w0->len=mr_mip->wt->len=2*ml;

    if (mr_decn(&(mr_mip->w0->w[ml]),w->w,m))
        mr_incn(mr_mip->modulus->w,w->w,m);

    mr_lzero(w);

}
```