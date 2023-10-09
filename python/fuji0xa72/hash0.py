import hashlib
import numpy as np

m = hashlib.sha256()
#file_path = 'myarray.txt'
#input_str = np.genfromtxt(file_path, delimiter=",")
#print(input_str)
input_str = input("enter text to be hashed: ")
zz=input_str.encode()
m.update(zz)
hash0 = m.hexdigest().lower()
hash0 = hash0
print(hash0)
input('click to escape')