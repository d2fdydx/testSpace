package CodeTmpl;
use Cwd; # module for finding the current working directory
use strict;
use Data::Dumper;
 use XML::Simple qw(:strict);
# This subroutine takes the name of a directory and recursively scans 
# down the filesystem from that point looking for files named "core"
sub ScanDirectory{
    my ($workdir) = shift; 

    my ($startdir) = &cwd; # keep track of where we began

    chdir($workdir) or die "Unable to enter dir $workdir:$!\n";
    opendir(my $dirList, ".") or die "Unable to open $workdir:$!\n";
    my @names = readdir($dirList) or die "Unable to read $workdir:$!\n";
    closedir($dirList);

    foreach my $name (@names){
        next if ($name eq "."); 
        next if ($name eq "..");

        if (-d $name){                  # is this a directory?
            print "dir $name\n";
            &ScanDirectory($name);
            next;
        }
        if (-f $name){
            genOutputFile($name);
        } 
        chdir($startdir) or 
           die "Unable to change to dir $startdir:$!\n";
    }
}

sub genOutputFile {
    our %wordLists;
    my $file = shift;
    open my $fileObj , $file or die "cannot open $file\n";
    my $result ="";
    while (<$fileObj>){
        if (/(#\{\W*(.*)\W*\})/){
            print "$1 and $2\n";
            if (defined $wordLists{$2}){
                my $temp= $wordLists{$2};
                $_ =~ s/$1/$temp/g;
                print $_."\n";
            }
        }
    }


}
sub buildDict{
    our %wordLists ;
    my $xml = shift;
    foreach my $pair (@{$xml->{pair}}){
       (my $new =$pair->{'key'})=~s/(\w*)/\u$1/g;
       print "get".$new."\n"  ;
        $wordLists{$pair->{'key'}} =$pair->{'value'};
    }

}
my $config = XMLin("config.xml", KeyAttr =>  'pair' ,ForceArray => [ 'pair' ] );
 print Dumper($config);
our %wordLists = qw //;
buildDict($config);

print $wordLists{"msg"}."\n";
print $wordLists{"table"}."\n";
&ScanDirectory($ARGV[0]);     