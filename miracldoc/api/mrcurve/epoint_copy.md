# epoint_copy

`epoint_copy`定义在`miracl.h`

```c
extern void epoint_copy(epoint *,epoint *);
```

`mrcurve.c`

```c
void epoint_copy(epoint *a,epoint *b)
{   
    if (a==b || b==NULL) return;

    copy(a->X,b->X);
    copy(a->Y,b->Y);
    copy(a->Z,b->Z);

    b->marker=a->marker;
    return;
}


void epoint_copy(epoint *a,epoint *b)
{   
    if (a==b || b==NULL) return;

    copy(a->X,b->X);
    copy(a->Y,b->Y);
#ifndef MR_AFFINE_ONLY
    if (a->marker==MR_EPOINT_GENERAL) copy(a->Z,b->Z);
#endif
    b->marker=a->marker;
    return;
}
```