# mr_compare

```c
extern int   mr_compare(big,big);
```

函数功能：比较两个数的大小，如果`x`大于	`y`，返回1；如果`x`小于	`y`，返回-1；否则返回0。

参数`x`：`big`类型数值。

参数`y`：`big`类型数值。

## 源码分析


```c
int mr_compare(big x,big y)
{  /* compare x and y: =1 if x>y  =-1 if x<y *
    *  =0 if x=y                             */
    int m,n,sig;
    mr_lentype sx,sy;
    if (x==y) return 0;
    sx=(x->len&MR_MSBIT);
    sy=(y->len&MR_MSBIT);
    if (sx==0) sig=PLUS;
    else       sig=MINUS;
    if (sx!=sy) return sig;
    m=(int)(x->len&MR_OBITS);
    n=(int)(y->len&MR_OBITS);
    if (m>n) return sig;
    if (m<n) return -sig;
    while (m>0)
    { /* check digit by digit */
        m--;  
        if (x->w[m]>y->w[m]) return sig;
        if (x->w[m]<y->w[m]) return -sig;
    }
    return 0;
}
```