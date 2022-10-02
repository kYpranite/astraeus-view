from lightkurve import search_targetpixelfile
import matplotlib.pyplot as plt
import star
import json

stars = []


# KIC 7198959 (RR Lyr) -Ceph
# KIC 7548061  (V1154 Cyg) -Ceph
# KIC 01026957 - Eclipse
# KIC 01433962 - Eclipse
# KIC 8462852 - Tabby's Star


def genStar(kic, name="", variability=""):
    pixelfile = search_targetpixelfile(kic, quarter=16).download()
    lc = pixelfile.to_lightcurve(aperture_mask='all')
    outputStar = star.Star(kic, lc.time, lc.flux, lc, variability, name)

    return outputStar


def outputJson(starObj):
    outputTime = []
    outputFlux = []

    for time in starObj.time:
        outputTime.append(str(time.mjd-54832.5))
    for flux in starObj.flux:
        outputFlux.append(str(flux.value))

    output = {
        "kic": starObj.kic,
        "time": outputTime,
        "flux": outputFlux,
        "name": starObj.name,
        "variability": starObj.variability
    }
    return json.dumps(output)


# stars.append(genStar("KIC 8462852", "Boyajian's Star"))
# stars.append(genStar("KIC 7548061", "V1154 Cyg", "CEPH"))
# stars.append(genStar("KIC 01026957", variability="ECLI"))
# stars.append(genStar("KIC 01433962", variability="ECLI"))
#
# for star in stars:
#     with open(star.kic + ".json", "w+") as outfile:
#         outfile.write(outputJson(star))
#         outfile.close()


plt.show()
