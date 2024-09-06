# iw-stepper component

The iw-stepper component a horizontal list of steps. A current step which is listed as a required parameter, allows
that step to be indicated as current and any preceding steps indicated as completed.

## Props
* *current* - A number indicating the current step in the process.
 

##### Example
```
<IWStepper current={2}>
   <IWStep id="Step-Cart" href="/insightweb/viewCart">Cart</IWStep>
   <IWStep id="Step-Ship-Bill">Ship Bill Pay</IWStep>
   <IWStep id="Step-Order">Place Order</IWStep>
</IWStepper>
```

# iw-step component
A step is one item in a series of items that must be completed by the user.

## Props
* *id* - An id tag to be included in the overall step.
* *href* - An anchor tag allows the step to become clickable with a link to the href.
* *(content)* - The content of the step component contains the label that will
be shown for that step

#### "`if/then`" Example
The steps can be included conditionally with either the "&amp;&amp;" technique for
a if statement.
```
    { showLineLevelStep &amp;&amp; 
        <IWStep id="Step-Edit-Line">Edit Line Level</IWStep>
    }
```
#### "`if/then/else`" Example
Or a ternary expression for an `if/then/else` statement.
```
    { isRequisition ?
        <IWStep id="Step-Requisition">Place Requisition</IWStep>
        :
        <IWStep id="Step-Order">Place Order</IWStep>
    }
```
