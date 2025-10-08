# ECn::double_add

```c
friend void double_add(ECn&,ECn&,ECn&,ECn&,big&,big&);
```

```c
#ifndef MR_EDWARDS
void double_add(ECn& A,ECn& B,ECn& C,ECn& D,big& s1,big& s2)
{
    ecurve_double_add(A.p,B.p,C.p,D.p,&s1,&s2);
}
#endif
```