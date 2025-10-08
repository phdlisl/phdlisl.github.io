# mr_karsqr

`mr_karsqr`

函数功能：

参数：

```c
static void mr_karsqr(int n,mr_small *t,mr_small *x,mr_small *z)
{ /* Squaring z=x*x */
    int i,nd2,m;
    mr_small c;
    if (n==MR_KCM)
    {
        mr_comba_sqr(x,z);
        return;
    }
    nd2=n/2;
    m=n/MR_KCM;
  
    mr_karsqr(nd2,&t[n],x,z);
    mr_karsqr(nd2,&t[n],&x[nd2],&z[n]);
    mr_karmul(nd2,&t[n],x,&x[nd2],t);

    c=mr_incn(t,&z[nd2],m);
    c+=mr_incn(t,&z[nd2],m);

    i=n+nd2;
    z[i]+=c;
    if (z[i]<c)
    { /* propagate carries - very rare */
        do 
        {
            i++;
            z[i]++;
        } while (z[i]==0);
    }
}
```