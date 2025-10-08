# mr_karmul

`mr_karmul`

函数功能：

参数：

```c
static void mr_karmul(int n,mr_small *t,mr_small *x,mr_small *y,mr_small *z)
{ /* full multiplication z=x*y */
    int i,nd2,m,md2;
    mr_small c1,c2,c=0;
    if (n==MR_KCM)
    { /* reached the bottom... */
        mr_comba_mul(x,y,z);
        return;
    }
    nd2=n/2;
    m=n/MR_KCM;
    md2=m/2;
 
    c1=mr_addn(x,&x[nd2],z,md2);
    c2=mr_addn(y,&y[nd2],&z[nd2],md2);
    mr_karmul(nd2,&t[n],z,&z[nd2],t);
    if (c1) c+=mr_incn(&z[nd2],&t[nd2],md2);
    if (c2) c+=mr_incn(z,&t[nd2],md2);
    if (c1&c2) c++;    /* form (a0+a1).(b0+b1), carry in c */
    mr_karmul(nd2,&t[n],x,y,z);
    c-=mr_decn(z,t,m);           /* subtract a0.b0 */
    mr_karmul(nd2,&t[n],&x[nd2],&y[nd2],&z[n]);
    c-=mr_decn(&z[n],t,m);       /* subtract a1.b1 */
    c+=mr_incn(t,&z[nd2],m);    /* combine results */

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