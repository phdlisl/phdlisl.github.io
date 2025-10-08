# comba_double_sub

`comba_double_sub`

```c
extern void  comba_double_sub(big,big,big);
```

函数功能：

参数

## 源码分析

`comba_double_sub`在模板文件`mrcomba.tpl`实现。

```c
void comba_double_sub(big x,big y,big w)
{ /* fast modular subtraction */
    unsigned int i;
    mr_small *a,*b,*c;
    mr_small carry,su;  
#ifdef MR_WIN64
    mr_small ma,mb,u;
#endif
#ifdef MR_ITANIUM
    mr_small ma,u;
#endif
#ifdef MR_NOASM
    mr_large u;
#endif

    if (x!=w && y!=w) 
    {
        for (i=2*MR_COMBA;i<(w->len&MR_OBITS);i++) w->w[i]=0;   
        /* zero(w); */
    }

    a=x->w; b=y->w; c=w->w;
/*** SUBTRACTION2 ***/

    w->len=2*MR_COMBA;
    if (w->w[2*MR_COMBA-1]==0) mr_lzero(w); 
}
```