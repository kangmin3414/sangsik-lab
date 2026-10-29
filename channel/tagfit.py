import sys,json
def cost(t): return len(t)+(2 if ' ' in t else 0)
def fit(existing,cands,limit=490):
    tot=sum(cost(t) for t in existing)+max(0,len(existing)-1)
    add=[]
    for c in cands:
        if c in existing or c in add: continue
        if tot+1+cost(c)>limit: continue
        add.append(c); tot+=1+cost(c)
    return add,tot
ex=json.loads(sys.argv[1]); ca=json.loads(sys.argv[2])
a,t=fit(ex,ca); print(t); print(', '.join(a)+',')
