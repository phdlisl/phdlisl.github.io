# kcm_mul

`kcm_mul`

```c
extern void  kcm_mul(_MIPT_ big,big,big);
```

函数功能：

参数：

## 源码分析

`kcm_mul`在模板文件`mrkcm.tpl`中实现。

```c
void kcm_mul(_MIPD_ big x,big y,big z)
{ /* fast karatsuba multiplication */ 
    unsigned int i;
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    int ml=(int)mr_mip->modulus->len;
    zero(mr_mip->w0);
    for (i=2*ml;i<(mr_mip->wt->len&MR_OBITS);i++) mr_mip->wt->w[i]=0;

    mr_karmul(ml,mr_mip->wt->w,x->w,y->w,mr_mip->w0->w);
    mr_mip->w0->len=mr_mip->wt->len=2*ml;
    copy(mr_mip->w0,z);
}
```