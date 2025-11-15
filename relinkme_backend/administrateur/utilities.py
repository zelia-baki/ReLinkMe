from passporteye import read_mrz

def passport_info_extraction(passport_image):
    mrz = read_mrz(passport_image)
    if mrz is None:
        print("MRZ not detected. Try a clearer or full passport image.")

    else:
        for label, value in mrz.to_dict().items():
            print(f"{label}: {value}")
    return mrz




