import rsa
from .constants import BASE_KEYS_FOLDER_PATH


def generate_and_save_private_public_key_pair(username,userid):
    pub,pri = rsa.newkeys(2048)

    with open(f"{BASE_KEYS_FOLDER_PATH}public_rsa_{username}_{userid}.pem","wb") as f:
        f.write(pub.save_pkcs1("PEM"))
    
    with open(f"{BASE_KEYS_FOLDER_PATH}private_rsa_{username}_{userid}.pem","wb") as f:
        f.write(pri.save_pkcs1("PEM"))
