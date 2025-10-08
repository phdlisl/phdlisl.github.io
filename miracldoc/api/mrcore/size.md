# size

`size`

```c
extern int   size(big);
```

函数功能：将`big`类型数据转换为`int`类型数据。

参数`x`：

## 源码分析


```c
int size(big x)
{  /*  get size of big number;  convert to *
    *  integer - if possible               */
    int n,m;
    mr_lentype s;
    if (x==NULL) return 0;
    s=(x->len&MR_MSBIT);
    m=(int)(x->len&MR_OBITS);
    if (m==0) return 0;
    if (m==1 && x->w[0]<(mr_small)MR_TOOBIG) n=(int)x->w[0];
    else                                     n=MR_TOOBIG;
    if (s==MR_MSBIT) return (-n);
    return n;
}
```