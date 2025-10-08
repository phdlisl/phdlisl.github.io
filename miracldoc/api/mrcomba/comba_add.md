# comba_add

`comba_add`

```c
extern void  comba_add(big,big,big);
```

函数功能：

参数

## 源码分析

`comba_add`在模板文件`mrcomba.tpl`实现。

```c
void comba_add(big x,big y,big w)
{ /* fast addition */
    unsigned int i;
    mr_small *a,*b,*c;
    mr_small carry,su; 
#ifdef MR_WIN64
    mr_small ma,mb,u;
#endif
#ifdef MR_ITANIUM
    mr_small ma,mb,u;
#endif
#ifdef MR_NOASM
    mr_large u;
#endif
    
    if (w!=x && w!=y) 
    {
        for (i=MR_COMBA;i<(w->len&MR_OBITS);i++) w->w[i]=0;
        /* zero(w); */
    }
    
    a=x->w; b=y->w; c=w->w;
/*** ADDITION ***/        /* add a and b, result in c */

    w->len=MR_COMBA;
    if (w->w[MR_COMBA-1]==0) mr_lzero(w);   
}
```