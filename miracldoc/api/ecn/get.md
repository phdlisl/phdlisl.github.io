# ECn::get

```c
int get(Big& x,Big& y) const;

// This gets the point in compressed form. Return value is LSB of y-coordinate
int get(Big& x) const;
```


```c
int ECn::get(Big& x,Big& y) const 
        {return epoint_get(p,x.getbig(),y.getbig());}
int ECn::get(Big& x) const   
        {return epoint_get(p,x.getbig(),x.getbig());}
```