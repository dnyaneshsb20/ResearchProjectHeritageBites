import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { supabase } from "../../../supabaseClient";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ContributorProfileModal = ({ contributorId, isOpen, onClose }) => {
    const [contributor, setContributor] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (contributorId && isOpen) {
            fetchContributor(contributorId);
        }
    }, [contributorId, isOpen]);

    const fetchContributor = async (id) => {
        setLoading(true);

        const { data, error } = await supabase
            .from("rec_contributions")
            .select(`
        created_by (
          user_id,
          name,
          email,
          location
        ),
        name,
        description,
        image_url,
        meal_type,
        status,
        created_at
      `)
            .eq("created_by", id);

        if (error) {
            console.error("Error fetching contributor details:", error);
            setContributor(null);
            setLoading(false);
            return;
        }

        if (!data || data.length === 0) {
            setContributor(null);
            setLoading(false);
            return;
        }

        const user = data[0].created_by;
        const specialties = [...new Set(data.map((d) => d.meal_type).filter(Boolean))];

        setContributor({
            id: user.user_id,
            name: user.name,
            email: user.email,
            location: user.location,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
            contributions: data,
            specialties,
        });

        setLoading(false);
    };

    if (!contributor && !loading) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-lg shadow-lg overflow-auto max-h-[80vh]">
                    {loading ? (
                        <p className="text-muted-foreground">Loading contributor details...</p>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
                                    <Image src={contributor.avatar} alt={contributor.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground">{contributor.name}</h2>
                                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                        <Icon name="MapPin" size={12} />
                                        <span>{contributor.location || "Unknown"}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{contributor.email}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Specialties</p>
                                <div className="flex flex-wrap gap-1">
                                    {contributor.specialties.slice(0, 5).map((s, i) => (
                                        <span key={i} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                            {s}
                                        </span>
                                    ))}
                                    {contributor.specialties.length > 5 && (
                                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                                            +{contributor.specialties.length - 5}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Contributions</p>
                                <ul className="space-y-1 max-h-64 overflow-y-auto">
                                    {contributor.contributions.map((c) => (
                                        <li key={c.name} className="border-b border-border pb-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-foreground">{c.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(c.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {c.description || "No description"}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Dialog.Close asChild>
                                    <Button variant="outline" size="sm">
                                        Close
                                    </Button>
                                </Dialog.Close>
                            </div>
                        </div>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ContributorProfileModal;
