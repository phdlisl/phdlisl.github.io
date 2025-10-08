# muldvd

`muldvd`

```c
extern mr_small muldvd(mr_small,mr_small,mr_small,mr_small *); 
```

```c
mr_small muldvd(mr_small a,mr_small b,mr_small c,mr_small *rp)
{
    union doubleword dble;
    dble.d=(mr_large)a*b+c;

    *rp=dble.h[MR_BOT];
    return dble.h[MR_TOP];
}
```