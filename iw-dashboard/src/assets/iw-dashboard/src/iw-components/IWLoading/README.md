# iw-loading component

The iw-loading component displays a spinning icon to represent there is currently work being performed.

```
   <IWLoading modal={false} className="iw-loading__size-large"></IWLoading>
```

## Props

### modal
true - Displays the spinner in a modal dialog box in the center of the screen (no close buttons)

false (default) - Displays the spinner inline.

### hide

true - hide the spinner component (whether modal or inline)

false (default) - show the spinner component (whether modal or inline)

## Helper ClassNames

### iw-loading__size - Set the size of the icon
```
iw-loading__size-tiny - 12px
iw-loading__size-small - 20px
iw-loading__size-medium - 30px (default)
iw-loading__size-large - 45px
iw-loading__size-giant - 60px
iw-loading__size-massive - 300px
```
### iw-loading__icon - Set the icon image
``` 
iw-loading__icon-refresh - ion-refresh
iw-loading__icon-bubbles - ion-load-a
iw-loading__icon-paddles - ion-load-b
iw-loading__icon-streak - ion-load-c (default)
iw-loading__icon-gear - ion-load-d
iw-loading__icon-recycle - ion-loop
```
