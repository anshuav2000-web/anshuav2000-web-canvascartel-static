import { useState, useMemo } from 'react';
import { icons, LucideIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Grid3X3, Check } from 'lucide-react';
import { toast } from 'sonner';

interface IconBrowserProps {
  onSelectIcon?: (iconName: string) => void;
  currentIcon?: string;
}

export const IconBrowser = ({ onSelectIcon, currentIcon }: IconBrowserProps) => {
  const [search, setSearch] = useState('');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const iconNames = useMemo(() => {
    return Object.keys(icons).filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleSelectIcon = (iconName: string) => {
    if (onSelectIcon) {
      onSelectIcon(iconName);
      setOpen(false);
      toast.success(`Selected ${iconName}`);
    } else {
      navigator.clipboard.writeText(`<${iconName} />`);
      setCopiedIcon(iconName);
      toast.success(`Copied <${iconName} /> to clipboard`);
      setTimeout(() => setCopiedIcon(null), 2000);
    }
  };

  // Get current icon component for preview
  const CurrentIconComponent = currentIcon && icons[currentIcon as keyof typeof icons] 
    ? (icons[currentIcon as keyof typeof icons] as LucideIcon)
    : null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {CurrentIconComponent ? (
            <CurrentIconComponent className="h-4 w-4" />
          ) : (
            <Grid3X3 className="h-4 w-4" />
          )}
          {onSelectIcon ? 'Browse Icons' : 'All Icons'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-0 bg-popover border-border z-50">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {iconNames.length} icons available
          </p>
        </div>
        <ScrollArea className="h-72">
          <div className="grid grid-cols-6 gap-1 p-2">
            {iconNames.slice(0, 150).map((name) => {
              const Icon = icons[name as keyof typeof icons] as LucideIcon;
              const isCopied = copiedIcon === name;
              const isSelected = currentIcon === name;
              return (
                <button
                  key={name}
                  onClick={() => handleSelectIcon(name)}
                  className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-accent transition-colors group relative ${isSelected ? 'bg-accent ring-2 ring-primary' : ''}`}
                  title={name}
                >
                  {isCopied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Icon className="h-5 w-5 text-foreground" />
                  )}
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-popover border border-border text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
          {iconNames.length > 150 && (
            <p className="text-xs text-muted-foreground text-center pb-2">
              Showing first 150 results. Refine your search.
            </p>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
