# ECn::is_on_curve

```c
#ifndef MR_NOSUPPORT_COMPRESSION
#ifndef MR_NOTESTXONCURVE


BOOL is_on_curve(const Big& a)
{ return epoint_x(a.fn);}

#endif
#endif
```