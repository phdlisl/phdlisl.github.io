# ECn::operator-

```c
friend ECn operator-(const ECn&);
```

```c
ECn operator-(const ECn& e)
{ ECn t=e; epoint_negate(t.p); return t;}
```