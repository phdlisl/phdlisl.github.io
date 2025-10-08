# muldiv

`muldiv`


```c
extern mr_small muldiv(mr_small,mr_small,mr_small,mr_small,mr_small *);
```

```c
/* C only versions of muldiv/muldvd/muldvd2/muldvm */
/* Note that mr_large should be twice the size of mr_small */

mr_small muldiv(mr_small a,mr_small b,mr_small c,mr_small m,mr_small *rp)
{
    mr_small q;
    mr_large ldres,p=(mr_large)a*b+c;
    q=(mr_small)(MR_LROUND(p/m));
    *rp=(mr_small)(p-(mr_large)q*m);
    return q;
}
```