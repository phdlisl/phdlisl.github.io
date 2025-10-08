# mr_lzero

`mr_lzero`

```c
extern void  mr_lzero(big);
```


```c
void mr_lzero(big x)
{  /*  strip leading zeros from big number  */
    mr_lentype s;
    int m;
    s=(x->len&(MR_MSBIT));
    m=(int)(x->len&(MR_OBITS));
    while (m>0 && x->w[m-1]==0)
        m--;
    x->len=m;
    if (m>0) x->len|=s;
}
```