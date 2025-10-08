# ECn::multi_norm

```c
friend void multi_norm(int,ECn *);
```


```c
#ifndef MR_EDWARDS
void multi_norm(int m,ECn* e)
{
    int i;
    Big w[20];
    big a[20];
    epoint *b[20];   
    for (i=0;i<m;i++)
    {
        a[i]=w[i].getbig();
        b[i]=e[i].p;
    }
    epoint_multi_norm(m,a,b);   
}
#endif
```