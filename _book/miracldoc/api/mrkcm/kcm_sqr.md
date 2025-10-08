# kcm_sqr

`kcm_sqr`


```c
extern void  kcm_sqr(_MIPT_ big,big); 
```

函数功能：

参数：

## 源码分析

`kcm_sqr`在模板文件`mrkcm.tpl`中实现。

```c
void kcm_sqr(_MIPD_ big x,big z)
{ /* fast karatsuba squaring */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    unsigned int i;
    int ml=(int)mr_mip->modulus->len;
    zero(mr_mip->w0);
    for (i=2*ml;i<(mr_mip->wt->len&MR_OBITS);i++) mr_mip->wt->w[i]=0;
    mr_karsqr(ml,mr_mip->wt->w,x->w,mr_mip->w0->w);
    mr_mip->w0->len=mr_mip->wt->len=2*ml;
    copy(mr_mip->w0,z);
}
```