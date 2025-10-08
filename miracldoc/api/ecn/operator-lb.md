# ECn::operator<<

```c
friend ostream& operator<<(ostream&,const ECn&);
```

```c
#ifndef MR_NO_STANDARD_IO

ostream& operator<<(ostream& s,const ECn& b)
{
    Big x,y;
    if (b.iszero())
        s << "(Infinity)";
    else
    {
        b.get(x,y);
        s << "(" << x << "," << y << ")";
    }
    return s;
}

#endif
```