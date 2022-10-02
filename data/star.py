import json


class Star:
    def __init__(self, kic, time, flux, lc, variability="", name=""):
        self.name = name
        self.kic = kic
        self.time = time
        self.flux = flux
        self.lc = lc

        if variability != "":
            self.variability = variability
        else:
            self.variability = ""
        if name != "":
            self.name = name
        else:
            self.name = ""

    def displayInfo(self):
        print(self.kic)
        print(self.time)
        print(self.flux)
        print(self.variability)
        print(self.name)

    def outputJson(self):
        outputTime = []
        outputFlux = []

        for time in self.time:
            outputTime.append(float(time.mjd - 54832.5))
        for flux in self.flux:
            outputFlux.append(float(flux.value))

        output = {
            "kic": self.kic,
            "time": outputTime,
            "flux": outputFlux,
            "name": self.name,
            "variability": self.variability
        }
        return json.dumps(output)
