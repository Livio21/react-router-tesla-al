import { useState } from "react";

const MobileView = () => {
  const [currentView, setCurrentView] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [testDriveStep, setTestDriveStep] = useState(1);

interface TestDriveFormEvent extends React.FormEvent<HTMLFormElement> {}

type CarModel = "Model S" | "Model 3" | "Model X" | "Model Y" | null;
type ViewType = "LOCATION" | "CONTACT" | "FORM" | "TEST_DRIVE" | null;

const handleTestDriveSubmit = (e: TestDriveFormEvent): void => {
    e.preventDefault();
    // Form submission logic would go here
    alert("Test drive requested!");
    setCurrentView(null);
    setTestDriveStep(1);
    setSelectedCar(null);
};

  const renderView = () => {
    switch (currentView) {
      case "LOCATION":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Our Location</h2>
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
              Map Placeholder
            </div>
          </div>
        );

      case "CONTACT":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <div className="space-y-2">
              <p>Email: contact@tesla.com</p>
              <p>Phone: 1-888-518-3752</p>
              <p>Address: 3500 Deer Creek Road, Palo Alto</p>
            </div>
          </div>
        );

      case "FORM":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Contact Form</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 rounded bg-zinc-700"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 rounded bg-zinc-700"
              />
              <textarea
                placeholder="Message"
                className="w-full p-2 rounded bg-zinc-700"
                rows={4}
              />
              <button type="submit" className="w-full py-2 bg-blue-600 rounded">
                Send Message
              </button>
            </form>
          </div>
        );

      case "TEST_DRIVE":
        return (
          <div className="p-4">
            {testDriveStep === 1 ? (
              <>
                <h2 className="text-xl font-bold mb-4">Select a Vehicle</h2>
                <div className="space-y-3">
                  {["Model S", "Model 3", "Model X", "Model Y"].map((car) => (
                    <div
                      key={car}
                      className={`p-3 rounded border ${
                        selectedCar === car
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-zinc-700"
                      }`}
                      onClick={() => setSelectedCar(car)}
                    >
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="car"
                          checked={selectedCar === car}
                          onChange={() => setSelectedCar(car)}
                          className="h-4 w-4"
                        />
                        <span>{car}</span>
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  disabled={!selectedCar}
                  onClick={() => setTestDriveStep(2)}
                  className={`w-full mt-6 py-2 rounded ${
                    selectedCar ? "bg-blue-600" : "bg-zinc-700 opacity-50"
                  }`}
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Test Drive Request</h2>
                <p className="mb-2">Selected: {selectedCar}</p>
                <form onSubmit={handleTestDriveSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full p-2 rounded bg-zinc-700"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    className="w-full p-2 rounded bg-zinc-700"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full p-2 rounded bg-zinc-700"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 rounded"
                  >
                    Request Test Drive
                  </button>
                </form>
              </>
            )}
          </div>
        );

      default:
        return (
          <>
            <div className="absolute z-0 w-full min-h-[300px]">
              <Scene cameraResetPosition={[-1.3, 0.5, -2]} />
            </div>
            <div className="z-10 flex-1 flex flex-col gap-4 w-full p-3">
              <div className="car-actions flex justify-between items-center p-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined">
                    lock
                  </span>
                ))}
              </div>
              <button
                className="bg-white/10 rounded flex justify-evenly items-center"
                onClick={() => setCurrentView("FORM")}
              >
                <span className="material-symbols-outlined p-4">mail</span>
                <div className="flex flex-col flex-1 py-2">
                  <span className="flex-1 text-xl font-bold">New Update</span>
                  <span>V.1</span>
                </div>
                <span className="material-symbols-outlined p-4">
                  chevron_right
                </span>
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className="bg-white/10 rounded-lg py-4 flex flex-col items-center"
                  onClick={() => setCurrentView("LOCATION")}
                >
                  <span className="material-symbols-outlined mb-2">
                    location_on
                  </span>
                  <span>Location</span>
                </button>
                <button
                  className="bg-white/10 rounded-lg py-4 flex flex-col items-center"
                  onClick={() => setCurrentView("CONTACT")}
                >
                  <span className="material-symbols-outlined mb-2">
                    contact_page
                  </span>
                  <span>Contact</span>
                </button>
                <button
                  className="bg-white/10 rounded-lg py-4 flex flex-col items-center"
                  onClick={() => setCurrentView("TEST_DRIVE")}
                >
                  <span className="material-symbols-outlined mb-2">
                    directions_car
                  </span>
                  <span>Test Drive</span>
                </button>
                <button
                  className="bg-white/10 rounded-lg py-4 flex flex-col items-center"
                  onClick={() => setCurrentView("FORM")}
                >
                  <span className="material-symbols-outlined mb-2">
                    description
                  </span>
                  <span>Form</span>
                </button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="mobile-view flex flex-col items-center justify-center w-full h-full bg-white dark:bg-zinc-800 text-white">
      <div className="flex flex-col items-center w-full min-h-[300px] max-w-[600px] relative">
        <div className="z-10 w-full rounded-b-lg shadow-2xl bg-zinc-900">
          {isDetailsOpen && (
            <div
              className="fixed inset-0 bg-black/70 z-20"
              onClick={() => setIsDetailsOpen(false)}
            />
          )}

          <details
            open={isDetailsOpen}
            onToggle={(e) => setIsDetailsOpen(e.currentTarget.open)}
            className="p-3"
          >
            <summary
              className="flex gap-6 items-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setIsDetailsOpen(!isDetailsOpen);
              }}
            >
              <div></div>
              <div className="flex-1 flex items-center">
                <span className="text-xl font-bold">TESLA</span>
                <span className="material-symbols-outlined">
                  keyboard_arrow_down
                </span>
              </div>
              <span className="material-symbols-outlined">sms</span>
              <span className="material-symbols-outlined">dehaze</span>
            </summary>
            <div
              className="flex flex-col w-full h-full gap-2 p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-[100px] p-1 border-b-[1px] border-zinc-700 items-center justify-between">
                <div className="flex flex-col justify-center flex-1">
                  <span>TESLA</span>
                  <span>99%</span>
                </div>
                <img
                  src="/Mega-Menu-Vehicles-Model-3.avif"
                  alt=""
                  className="max-w-[150px] object-contain"
                />
              </div>
              <button className="self-start flex gap-2 items-center text-sm font-medium py-2">
                <span className="material-symbols-outlined">add</span>
                Add Product
              </button>
              <div className="rounded h-[4px] bg-white/30 w-1/4 self-center"></div>
            </div>
          </details>
        </div>
        {renderView()}
      </div>
    </div>
  );
};
export default MobileView;