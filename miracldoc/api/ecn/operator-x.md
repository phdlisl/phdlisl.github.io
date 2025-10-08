# ECn::operator*

```c
friend ECn operator*(const Big &,const ECn&);
```

```c
ECn operator*(const Big& e,const ECn& b)
{
    ECn t;
    ecurve_mult(e.getbig(),b.p,t.p);
    return t;
}
```