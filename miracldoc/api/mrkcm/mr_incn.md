# mr_incn

`mr_incn`

函数功能：

参数：


```c
static int mr_incn(mr_small *y,mr_small *z,int n)
{ /* add to an array of length n*MR_KCM */
    mr_small *a,*b;
    mr_small carry;
#ifdef MR_WIN64
    mr_small ma,u;
#endif
#ifdef MR_ITANIUM
    register mr_small ma,u;
#endif
#ifdef MR_NOASM
    mr_large u;
#endif

    a=z; b=y;

/*** INCREMENTATION */

    return (int)carry;
}
```