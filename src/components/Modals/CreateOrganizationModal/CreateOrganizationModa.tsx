import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { organizationService } from "@/service/organization.service";
import { organizationQueryService } from "@/service/queries/organization.queries";
import { useGlobalStore } from "@/store/global-store";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateOrganizationFormType, createOrganizationSchema } from "./types";

export const CreateOrganizationModal = NiceModal.create(() => {
  const updateCurrentOrganization = useGlobalStore((s) => s.updateCurrentOrganization);
  const modal = useModal();
  const form = useForm<CreateOrganizationFormType>({
    resolver: zodResolver(createOrganizationSchema),
    mode: 'onSubmit',
  });

  const countryId = form.watch('countryId');
  const stateId = form.watch('stateId');

  const { data: countryList = [], isLoading: isCountryLoading } = organizationQueryService.useCountryList(modal.visible);
  const { data: stateList = [], isLoading: isStateLoading } = organizationQueryService.useStateList(countryId);
  const { data: organizationTypes = [], isLoading: isOrgTypeLoading } = organizationQueryService.useOrgTypeList(modal.visible);
  const { data: districtList = [], isLoading: isDistrictLoading } = organizationQueryService.useDistrictList(stateId);
  const { mutate: createOrg, isPending } = organizationQueryService.useCreateOrganization();

  // Add new state for tracking geolocation loading
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Add useEffect for geolocation
  useEffect(() => {
    if (!modal.visible || countryList.length === 0) return;

    const getLocationAndPrefill = async () => {
      setIsLoadingLocation(true);
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
        );
        const data = await response.json();

        // Find country in the list
        const country = countryList.find(
          (c) => c.name.toLowerCase() === data.countryName.toLowerCase()
        );

        if (country && country.name) {
          // Set country values
          form.setValue('countryId', country.id, { shouldDirty: true, shouldTouch: true });
          form.setValue('countryName', country.name, { shouldDirty: true, shouldTouch: true });

          if (country.name.toLowerCase() === 'bangladesh') {
            const states = await organizationService.getStateList(country.id);
            const dhakaState = states.find(
              (s) => s.name.toLowerCase() === 'dhaka'
            );

            if (dhakaState) {
              form.setValue('stateId', dhakaState.id, { shouldDirty: true, shouldTouch: true });
              form.setValue('stateName', dhakaState.name, { shouldDirty: true, shouldTouch: true });

              const districts = await organizationService.getDistrictList(dhakaState.id);
              const dhakaDistrict = districts.find(
                (d) => d.name.toLowerCase() === 'dhaka'
              );

              if (dhakaDistrict) {
                form.setValue('districtId', dhakaDistrict.id, { shouldDirty: true, shouldTouch: true });
                form.setValue('districtName', dhakaDistrict.name, { shouldDirty: true, shouldTouch: true });
              }
            }
          } else {
            const states = await organizationService.getStateList(country.id);
            if (states.length > 0) {
              form.setValue('stateId', states[0].id, { shouldDirty: true, shouldTouch: true });
              form.setValue('stateName', states[0].name, { shouldDirty: true, shouldTouch: true });

              const districts = await organizationService.getDistrictList(states[0].id);
              if (districts.length > 0) {
                form.setValue('districtId', districts[0].id, { shouldDirty: true, shouldTouch: true });
                form.setValue('districtName', districts[0].name, { shouldDirty: true, shouldTouch: true });
              }
            }
          }
        }
      } catch (error) {
        if (countryList.length > 0) {
          const firstCountry = countryList[0];
          form.setValue('countryId', firstCountry.id, { shouldDirty: true, shouldTouch: true });
          form.setValue('countryName', firstCountry.name, { shouldDirty: true, shouldTouch: true });
        }
      } finally {
        setIsLoadingLocation(false);
      }
    };

    getLocationAndPrefill();
  }, [modal.visible, countryList.length]);

  const handleSubmit = async (data: CreateOrganizationFormType) => {
    createOrg(data, {
      onSuccess: async (data) => {
        updateCurrentOrganization(data);
        modal.remove();
      }
    });
  };

  return (
    <Dialog open={modal.visible} onOpenChange={modal.remove}>
      <DialogContent className="max-h-[96vh] w-max p-6 overflow-y-auto gap-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Create Organization
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-6">
            {/* Basic Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Organization Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            className="pl-9 h-10"
                            placeholder="Enter organization name"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Organization Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))}>
                        <FormControl>
                          <SelectTrigger className="h-10">
                            {isOrgTypeLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading...</span>
                              </div>
                            ) : (
                              <SelectValue placeholder="Select organization type" />
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {organizationTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()} className="cursor-pointer">
                              {type.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Location Details</h3>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input {...field} className="pl-9 h-10" placeholder="Enter full address" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="countryName"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Country <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        value={String(form.watch('countryId'))}
                        onValueChange={value => {
                          const country = countryList.find(c => c.id === Number(value));
                          if (country) {
                            form.setValue('countryId', country.id, { shouldDirty: true });
                            form.setValue('countryName', country.name, { shouldDirty: true });
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            {isCountryLoading || isLoadingLocation ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading...</span>
                              </div>
                            ) : (
                              <SelectValue placeholder="Select country">
                                {form.watch('countryName')}
                              </SelectValue>
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px] overflow-y-auto">
                          {countryList.map((country) => (
                            <SelectItem
                              key={country.id}
                              value={String(country.id)}
                              className="cursor-pointer"
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stateName"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        State <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        disabled={form.watch('countryId') === undefined}
                        value={String(form.watch('stateId'))}
                        onValueChange={value => {
                          const state = stateList.find(s => s.id === Number(value));
                          if (state) {
                            form.setValue('stateId', state.id, { shouldDirty: true });
                            form.setValue('stateName', state.name, { shouldDirty: true });
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            {isStateLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading...</span>
                              </div>
                            ) : (
                              <SelectValue placeholder="Select state">
                                {form.watch('stateName')}
                              </SelectValue>
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[250px] overflow-y-auto">
                          {stateList.map((state) => (
                            <SelectItem
                              key={state.id}
                              value={String(state.id)}
                              className="cursor-pointer"
                            >
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="districtName"
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        District <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        disabled={!form.watch('stateId')}
                        value={String(form.watch('districtId'))}
                        onValueChange={value => {
                          const district = districtList.find(d => d.id === Number(value));
                          if (district) {
                            form.setValue('districtId', district.id, { shouldDirty: true });
                            form.setValue('districtName', district.name, { shouldDirty: true });
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10">
                            {isDistrictLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading...</span>
                              </div>
                            ) : (
                              <SelectValue placeholder="Select district">
                                {form.watch('districtName')}
                              </SelectValue>
                            )}
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[250px] overflow-y-auto">
                          {districtList.map((district) => (
                            <SelectItem
                              key={district.id}
                              value={String(district.id)}
                              className="cursor-pointer"
                            >
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            className="pl-9 h-10"
                            placeholder="organization@example.com"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Phone <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            className="pl-9 h-10"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>


            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={modal.hide}
                className="bg-white hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !form.formState.isDirty}>
                Create Organization
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
