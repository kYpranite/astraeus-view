from lightkurve import search_targetpixelfile
import matplotlib.pyplot as plt
import star

stars = []
# KIC 7548061  (V1154 Cyg) -Ceph
# KIC 01026957 - Eclipse
# KIC 01433962 - Eclipse
# KIC 8462852 - Tabby's Star


def genStar(kic, name="", variability=""):
    pixelfile = search_targetpixelfile(kic, quarter=16).download()
    lc = pixelfile.to_lightcurve(aperture_mask='all')
    outputStar = star.Star(kic, lc.time, lc.flux, lc, variability, name)

    return outputStar


# stars.append(genStar("KIC 8462852", "Boyajian's Star"))
# stars.append(genStar("KIC 7548061", "V1154 Cyg", "CEPH"))
# stars.append(genStar("KIC 01026957", variability="ECLI"))
# stars.append(genStar("KIC 3733346"))

# lyr = genStar("KIC 3733346")
# lyr.lc.plot()

# for star in stars:
#     with open(star.kic + ".json", "w+") as outfile:
#         outfile.write(star.outputJson())
#         outfile.close()

plt.show()
