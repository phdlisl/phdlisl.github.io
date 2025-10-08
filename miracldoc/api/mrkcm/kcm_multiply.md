# kcm_multiply

`kcm_multiply`

```c
extern void  kcm_multiply(_MIPT_ int,big,big,big);
```

函数功能：

参数：

## 源码分析

`kcm_multiply`在模板文件`mrkcm.tpl`中实现。

```c
void kcm_multiply(_MIPD_ int n,big x,big y,big z)
{ /* n *must* be MR_KCM*2^m for m>=0 */   
    unsigned int i;
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    zero(mr_mip->w0);
    for (i=2*n;i<(mr_mip->wt->len&MR_OBITS);i++) mr_mip->wt->w[i]=0;
    mr_karmul(n,mr_mip->wt->w,x->w,y->w,mr_mip->w0->w);
    mr_mip->w0->len=mr_mip->wt->len=2*n;
    copy(mr_mip->w0,z);
}
```