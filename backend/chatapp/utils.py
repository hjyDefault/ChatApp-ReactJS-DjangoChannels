import random
import string

def get_file_extension(file_name):
    file_name_parts = file_name.split('.')
    file_extension = file_name_parts[len(file_name_parts)-1]
    return file_extension

def generate_random_string():
    length = 10
    characters = string.ascii_letters+string.digits

    random_string = ''.join((random.choice(characters)) for i in range(length))

    return random_string

def get_file_name_without_extension(filename):
    last_dot_index = filename.rfind(".")

    # if there is a dot in the filename
    if last_dot_index != -1:
        # remove the extension from the filename
        filename_without_extension = filename[:last_dot_index]
    else:
        # otherwise, just use the original filename
        filename_without_extension = filename

    return filename_without_extension