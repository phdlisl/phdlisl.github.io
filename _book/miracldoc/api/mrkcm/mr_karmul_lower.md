# mr_karmul_lower

`mr_karmul_lower`

函数功能：

参数：

```c
static void mr_karmul_lower(int n,mr_small *t,mr_small *x,mr_small *y,mr_small *z)
{ /* Calculates Least Significant bottom half of x*y */
    int nd2,m,md2;
    if (n==MR_KCM)
    { /* only calculate bottom half of product */
        mr_comba_halfm(x,y,z);
        return;
    }
    nd2=n/2;
    m=n/MR_KCM;
    md2=m/2;

    mr_karmul(nd2,&t[n],x,y,z);
    mr_karmul_lower(nd2,&t[n],&x[nd2],y,t); 
    mr_incn(t,&z[nd2],md2);
    mr_karmul_lower(nd2,&t[n],x,&y[nd2],t); 
    mr_incn(t,&z[nd2],md2);
}
```